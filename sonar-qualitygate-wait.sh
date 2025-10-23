#!/usr/bin/env bash
set -euo pipefail

SONAR_HOST_URL=$1
PROJECT_KEY=$2
SONAR_TOKEN=$3

max_retries=30
sleep_seconds=6

for i in $(seq 1 $max_retries); do
  echo "Attempt $i: checking SonarQube analyses..."
  analysis_json=$(curl -s -u "${SONAR_TOKEN}:" "${SONAR_HOST_URL}/api/project_analyses/search?project=${PROJECT_KEY}&ps=1")
  analysis_id=$(echo "$analysis_json" | python3 -c "import sys,json as j; d=j.load(sys.stdin); a=d.get('analyses',[]); print(a[0]['key'] if a else '')")
  if [ -z "$analysis_id" ]; then
    echo "No analysis yet. Sleeping ${sleep_seconds}s..."
    sleep ${sleep_seconds}
    continue
  fi

  echo "Found analysis id: $analysis_id. Checking quality gate..."
  qg_status=$(curl -s -u "${SONAR_TOKEN}:" "${SONAR_HOST_URL}/api/qualitygates/project_status?analysisId=${analysis_id}" | python3 -c "import sys,json as j; print(j.load(sys.stdin)['projectStatus']['status'])")
  echo "Quality gate status: $qg_status"
  if [ "$qg_status" = "OK" ]; then
    echo "Quality gate passed."
    exit 0
  elif [ "$qg_status" = "ERROR" ]; then
    echo "Quality gate failed!"
    exit 1
  else
    echo "Quality gate not ready yet (status=$qg_status). Retry in ${sleep_seconds}s..."
    sleep ${sleep_seconds}
  fi
done

echo "Timed out waiting for SonarQube quality gate"
exit 2
