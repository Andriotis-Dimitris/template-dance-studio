#exit the script immediately if any command returns an error status
set -e

# start Rails
(cd backend && rails s -p 3001) &
# start Next.js
(cd web     && yarn dev -p 3000) &
# start Expo
(cd mobile  && yarn start) &

wait
