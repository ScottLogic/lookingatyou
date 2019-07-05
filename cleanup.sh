# regex for feature branches
REGEX="\([Ff]eature\)\/[0-9a-zA-Z\-]*"

# get all remote feature branches
ALL_BRANCHES="$(git branch -r | grep ${REGEX})"
# get all merged feature branches from the git log
MERGED_BRANCHES="$(git log | grep ${REGEX})"

# get the list of deployed branches
DEPLOYED_BRANCHES="$(aws s3 ls s3://looking-at-you/feature/)"

for branch in $ALL_BRANCHES; do
    echo $branch
done

for branch in $MERGED_BRANCHES; do
    echo $branch
done

for branch in $DEPLOYED_BRANCHES; do
    echo $branch
done
