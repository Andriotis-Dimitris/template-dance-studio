class SessionsController < ApplicationController
  def google
    id_token = params[:id_token]
    validator = GoogleIDToken::Validator.new
    payload = validator.check(id_token, ENV.fetch('GOOGLE_CLIENT_ID'))
    google_uid = payload['sub']
    email = payload['email']

    user = User.find_by(google_uid: google_uid)
    unless user
      user = User.find_by(email: email)
      user.update!(google_uid: google_uid) if user
    end
    user ||= User.create!(email: email, google_uid: google_uid)

    render json: { id: user.id, email: user.email }
  rescue StandardError
    head :unauthorized
  end

  def email
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      render json: { id: user.id, email: user.email }
    else
      head :unauthorized
    end
  end
end
