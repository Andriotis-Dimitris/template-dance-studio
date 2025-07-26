1. Enable and install WSL2 + Ubuntu

2. Update Ubuntu and install core build tools
  
sudo apt update && sudo apt upgrade -y
sudo apt install -y \
  libffi-dev \
  libyaml-dev \
  libgdbm-dev \
  libncurses5-dev \
  libreadline-dev \
  libssl-dev \
  libpq-dev \
  zlib1g-dev \
  autoconf \
  bison \
  build-essential

3. Install rbenv & Ruby
4. Install Node.js (LTS) and Yarn

5. Install PostgreSQL
  
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres createuser --superuser $USER
createdb $USER
# Optional: set a password
# sudo -u postgres psql -c "ALTER USER $USER WITH PASSWORD 'your_password';"

6. Set up the Rails API + SSR (backend)

bundle install
rails db:create

You now have backend/ with:
app/controllers → your API controllers
app/views/layouts/application.html.erb → SSR layout if you choose to render HTML


🎉 You now have a Windows-friendly full-stack monorepo with:
backend/ – Rails API + SSR
web/ – Next.js + React Native Web
mobile/ – Expo React Native
