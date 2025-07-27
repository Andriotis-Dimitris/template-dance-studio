require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  describe 'POST /login/google' do
    let(:validator) { instance_double(GoogleIDToken::Validator) }
    let(:payload) { { 'sub' => 'google123', 'email' => 'test@example.com' } }

    before do
      ENV['GOOGLE_CLIENT_ID'] = 'test-client'
      allow(GoogleIDToken::Validator).to receive(:new).and_return(validator)
      allow(validator).to receive(:check).and_return(payload)
    end

    context 'when user exists with google_uid' do
      let!(:user) { User.create!(email: 'test@example.com', google_uid: 'google123') }

      it 'returns existing user' do
        post '/login/google', params: { id_token: 'token' }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['id']).to eq(user.id)
      end
    end

    context 'when email-only user exists' do
      let!(:user) { User.create!(email: 'test@example.com') }

      it 'links the google account' do
        post '/login/google', params: { id_token: 'token' }
        expect(response).to have_http_status(:ok)
        expect(user.reload.google_uid).to eq('google123')
      end
    end

    context 'when no user exists' do
      it 'creates a new user' do
        expect {
          post '/login/google', params: { id_token: 'token' }
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when the token is invalid' do
      before do
        allow(validator).to receive(:check).and_raise(StandardError)
      end

      it 'returns unauthorized' do
        post '/login/google', params: { id_token: 'bad' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /login/email' do
    let!(:user) { User.create!(email: 'email@example.com', password: 'secret') }

    it 'authenticates valid credentials' do
      post '/login/email', params: { email: 'email@example.com', password: 'secret' }
      expect(response).to have_http_status(:ok)
    end

    it 'rejects invalid credentials' do
      post '/login/email', params: { email: 'email@example.com', password: 'wrong' }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
