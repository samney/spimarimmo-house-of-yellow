# HOY-070: fetch remaining project-index videos (authorized public assets).
$vids = @(
 @{id='1151543609';r='720p';sig='fe6924b71be388cc756cdbd9685a86e2a7cf6a2d7f27d4150575024dc12a0002'},
 @{id='1151558347';r='720p';sig='3416f11fbc081b6878b269cffcbe9161e9a81e521230cdf36b53d312f6db4e4f'},
 @{id='1188086313';r='720p';sig='06784fe72bac46ae18ddc1e36230803f95fc7c847d46630e1822e51f0290a0f7'},
 @{id='1188069712';r='720p';sig='1fff441e1c2049abefebd7560890338706f93197c1594878afb91c7ec6d14179'},
 @{id='1194265974';r='720p';sig='192166d5060dc4d041c55effd52c109566b5a2ad62d53eb450019632a5e11522'},
 @{id='1188638365';r='720p';sig='d5100a47804ea416e7d03a8f50ce11f802b76ab33ffee0b96b65bf62a78431bb'},
 @{id='1151544155';r='720p';sig='bbe3a0c0055943b6b1256b7a07a508c83c27b4010fe963048c61e42993b8f3c8'},
 @{id='1188043705';r='720p';sig='b052f9281b4634367b75648e61f42e2aad838f4c832b54cf364a8d2c70ef7703'},
 @{id='1188055326';r='720p';sig='c7bf0969d54a188f007e96f6a1b146a5b99c7d623f3b70d673e07c708e4136fa'},
 @{id='1148957680';r='720p';sig='ce52d60d61cca698fcf4c5d89e4d78e900b3d6b201435d45251ceb34695ad64d'},
 @{id='1151597998';r='720p';sig='950aaf5ec07d279b74190e35c14e533c61a032b83665b0f1661ce3a378caddb6'},
 @{id='1194280833';r='720p';sig='9ec851cac833e4a767e8957cc85a0b090e3cf91fe79a948c0da811d167a59c02'},
 @{id='1151544468';r='540p';sig='25db97a0eb17238e950aee4079e31c6f1154736ce1e69ff19eb08f2eaa9bb8ec'},
 @{id='1148957309';r='540p';sig='b9bb9d207bc661ea39a5e168be48de84762c57e3241bd81fbc42a50bceaf4d2b'}
)
foreach ($v in $vids) {
  $out = "public\videos\vid-$($v.id)-$($v.r).mp4"
  if (Test-Path $out) { Write-Output "skip $($v.id)"; continue }
  $url = "https://player.vimeo.com/progressive_redirect/playback/$($v.id)/rendition/$($v.r)/file.mp4%20%28$($v.r)%29.mp4?loc=external&signature=$($v.sig)"
  curl.exe -sS -L --max-time 240 -o $out $url
  if ($LASTEXITCODE -eq 0) { Write-Output "ok $($v.id) $([math]::Round((Get-Item $out).Length/1MB,1))MB" } else { Write-Output "FAIL $($v.id)" }
}
Write-Output "DONE"
