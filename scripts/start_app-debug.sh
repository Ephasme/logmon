nodemon --watch src --inspect=5858 -r ts-node/register ./src/index.ts \
    --filename data/access.log \
    --renderDelay 800 \
    --batchAnalysisDelay 5000 \
    --avgHitsPerSecondsThreshold 12 \
    --avgHitsPerSecondsDuration 80 \
    --avgHitsPerSecondsDelay 3000