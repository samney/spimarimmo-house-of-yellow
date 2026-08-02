export class DeliveryError extends Error {
  constructor(code, { retryable = true, retryAfterSeconds = 60 } = {}) {
    super(code);
    this.name = "DeliveryError";
    this.code = code;
    this.retryable = retryable;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const localeCopy = (locale) => {
  if (locale === "fr") {
    return {
      receivedSubject: "Nous avons bien reçu votre demande",
      receivedBody: "Merci. Votre demande a bien été reçue.",
      resourceSubject: "Votre ressource demandée",
      resourceBody:
        "Votre ressource est disponible via le lien sécurisé ci-dessous.",
      appointmentSubject: "Confirmation de votre rendez-vous",
      appointmentBody: "Votre demande de rendez-vous a bien été reçue.",
      linkLabel: "Ouvrir la ressource",
    };
  }
  if (locale === "ar") {
    return {
      receivedSubject: "تم استلام طلبك",
      receivedBody: "شكراً لك. تم استلام طلبك بنجاح.",
      resourceSubject: "المورد الذي طلبته",
      resourceBody: "المورد متاح عبر الرابط الآمن أدناه.",
      appointmentSubject: "تأكيد طلب الموعد",
      appointmentBody: "تم استلام طلب الموعد بنجاح.",
      linkLabel: "فتح المورد",
    };
  }
  return {
    receivedSubject: "We received your request",
    receivedBody: "Thank you. Your request has been received.",
    resourceSubject: "Your requested resource",
    resourceBody: "Your resource is available through the secure link below.",
    appointmentSubject: "Appointment request confirmation",
    appointmentBody: "Your appointment request has been received.",
    linkLabel: "Open resource",
  };
};

const requireEmail = (value, code = "invalid_recipient") => {
  if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new DeliveryError(code, { retryable: false });
  }
  return value;
};

const renderContactNotification = (job, notificationTo, fromEmail) => {
  const context = job.job_context;
  const name =
    [context.first_name, context.last_name].filter(Boolean).join(" ") ||
    "Unknown";
  const message = context.submission_message
    ? `<p><strong>Message</strong><br>${
      escapeHtml(context.submission_message)
    }</p>`
    : "";
  return {
    from: fromEmail,
    to: requireEmail(notificationTo, "invalid_notification_recipient"),
    subject: `[${context.site_name ?? context.site_slug}] New contact request`,
    html:
      `<h1>New contact request</h1><p><strong>Name:</strong> ${
        escapeHtml(name)
      }</p>` +
      `<p><strong>Email:</strong> ${
        escapeHtml(context.contact_email ?? "Not provided")
      }</p>${message}`,
  };
};

const renderConfirmation = (job, fromEmail) => {
  const context = job.job_context;
  const copy = localeCopy(context.locale);
  const appointment = context.appointment_starts_at
    ? `<p>${escapeHtml(context.appointment_starts_at)} (${
      escapeHtml(context.appointment_timezone ?? "UTC")
    })</p>`
    : "";
  const isAppointment = Boolean(context.appointment_id);
  return {
    from: fromEmail,
    to: requireEmail(context.contact_email),
    subject: isAppointment ? copy.appointmentSubject : copy.receivedSubject,
    html: `<div dir="${context.locale === "ar" ? "rtl" : "ltr"}"><p>${
      escapeHtml(
        isAppointment ? copy.appointmentBody : copy.receivedBody,
      )
    }</p>${appointment}</div>`,
  };
};

const renderResourceDelivery = async (job, fromEmail, resolveResourceUrl) => {
  const context = job.job_context;
  const copy = localeCopy(context.locale);
  const url = await resolveResourceUrl(context);
  if (typeof url !== "string" || !url.startsWith("https://")) {
    throw new DeliveryError("resource_unavailable", { retryable: false });
  }
  return {
    from: fromEmail,
    to: requireEmail(context.contact_email),
    subject: context.resource_title || copy.resourceSubject,
    html: `<div dir="${context.locale === "ar" ? "rtl" : "ltr"}">` +
      `<p>${escapeHtml(copy.resourceBody)}</p>` +
      `<p><a href="${escapeHtml(url)}">${
        escapeHtml(copy.linkLabel)
      }</a></p></div>`,
  };
};

const normalizeFailure = (error, attemptCount) => {
  if (error instanceof DeliveryError) return error;
  const retryAfterSeconds = Math.min(
    3600,
    30 * 2 ** Math.max(0, attemptCount - 1),
  );
  return new DeliveryError("provider_unavailable", {
    retryable: true,
    retryAfterSeconds,
  });
};

export async function processIntegrationJobs({
  jobs,
  notificationTo,
  fromEmail,
  sendEmail,
  resolveResourceUrl,
  sendWebhook,
  completeJob,
  failJob,
}) {
  const outcomes = [];
  for (const job of jobs) {
    try {
      let providerMessageId = null;
      if (job.job_kind === "contact_notification") {
        providerMessageId = await sendEmail(
          renderContactNotification(job, notificationTo, fromEmail),
          job.job_id,
        );
      } else if (job.job_kind === "confirmation_email") {
        providerMessageId = await sendEmail(
          renderConfirmation(job, fromEmail),
          job.job_id,
        );
      } else if (job.job_kind === "resource_delivery") {
        providerMessageId = await sendEmail(
          await renderResourceDelivery(job, fromEmail, resolveResourceUrl),
          job.job_id,
        );
      } else if (
        job.job_kind === "calendar_sync" || job.job_kind === "webhook"
      ) {
        providerMessageId = await sendWebhook(job);
      } else {
        throw new DeliveryError("unsupported_job_kind", { retryable: false });
      }
      await completeJob(job.job_id, providerMessageId);
      outcomes.push({ jobId: job.job_id, status: "succeeded" });
    } catch (error) {
      const failure = normalizeFailure(error, job.attempt_count);
      await failJob(job.job_id, {
        code: failure.code,
        retryable: failure.retryable,
        retryAfterSeconds: failure.retryAfterSeconds,
      });
      outcomes.push({
        jobId: job.job_id,
        status: failure.retryable ? "retry_scheduled" : "dead_letter",
        errorCode: failure.code,
      });
    }
  }
  return outcomes;
}

const safeSecretEqual = async (candidate, expected) => {
  if (typeof candidate !== "string" || typeof expected !== "string") {
    return false;
  }
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const leftBytes = new Uint8Array(left);
  const rightBytes = new Uint8Array(right);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
};

export function createIntegrationWorkerHandler(
  { workerSecret, claimJobs, processJobs, onError = (_error) => {} },
) {
  if (typeof workerSecret !== "string" || workerSecret.length < 32) {
    throw new Error("WORKER_SHARED_SECRET must contain at least 32 characters");
  }
  return async (request) => {
    if (request.method !== "POST") {
      return Response.json(
        { ok: false, error: { code: "method_not_allowed" } },
        {
          status: 405,
          headers: { allow: "POST", "cache-control": "no-store" },
        },
      );
    }
    const authorization = request.headers.get("authorization") ?? "";
    const candidate = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";
    if (!(await safeSecretEqual(candidate, workerSecret))) {
      return Response.json({ ok: false, error: { code: "unauthorized" } }, {
        status: 401,
        headers: { "cache-control": "no-store" },
      });
    }

    try {
      const jobs = await claimJobs();
      const outcomes = await processJobs(jobs);
      return Response.json({
        ok: true,
        claimed: jobs.length,
        succeeded: outcomes.filter((item) =>
          item.status === "succeeded"
        ).length,
        retryScheduled: outcomes.filter((item) =>
          item.status === "retry_scheduled"
        ).length,
        deadLetter: outcomes.filter((item) =>
          item.status === "dead_letter"
        ).length,
      }, { headers: { "cache-control": "no-store" } });
    } catch (error) {
      onError(error);
      return Response.json(
        { ok: false, error: { code: "worker_unavailable" } },
        {
          status: 503,
          headers: { "cache-control": "no-store" },
        },
      );
    }
  };
}
