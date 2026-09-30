#!/usr/bin/env bash

databricks postgres update-endpoint \
  projects/ships-log/branches/production/endpoints/primary \
  spec.disabled \
  --json '{"spec": {"disabled": false}}'