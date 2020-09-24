if [[ "$CONTEXT" = "production" ]]
then
  hugo --gc -b $URL
else
  hugo --gc -b $DEPLOY_PRIME_URL
fi
