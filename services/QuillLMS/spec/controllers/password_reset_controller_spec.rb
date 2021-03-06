require 'rails_helper'

describe PasswordResetController do
  describe '#index' do
    let(:new_user)  { double(:user) }

    before do
      allow(User).to receive(:new) { new_user }
    end

    it 'should set a new user' do
      get :index
      expect(assigns(:user)).to eq new_user
    end
  end

  describe '#create' do
    context 'when user exists' do
      let!(:user) { create(:user) }
      let(:mailer) { double(:mailer, deliver_now!: true) }

      before do
        allow(UserMailer).to receive(:password_reset_email) { mailer }
      end

      it 'should refresh the token, send the password reset mailer and redirect to index path' do
        expect_any_instance_of(User).to receive(:refresh_token!)
        expect(UserMailer).to receive(:password_reset_email).with(user)
        post :create, user: { email: user.email }
        expect(response).to redirect_to password_reset_index_path
      end
    end

    context 'when user does not exist' do
      it 'should render the index page and show error' do
        post :create, user: { email: "test@test.com" }
        expect(flash[:error]).to eq 'We can\'t find that email in our system.'
        expect(response).to render_template :index
      end
    end
  end

  describe '#show' do
    context 'when user exists' do
      let!(:user) { create(:user) }

      before do
        user.refresh_token!
      end

      it 'should set the user' do
        get :show, id: user.token
        expect(assigns(:user)).to eq user
      end
    end

    context 'when user does not exists' do
      it 'should redirect to password reset index' do
        get :show, id: 1234
        expect(response).to redirect_to password_reset_index_path
      end
    end
  end

  describe '#update' do
    before do
      @user = create(:user)
      @user.refresh_token!
    end

    context 'when passwords match' do
      it 'should update the sign the user in and redirect to profile path' do
        expect(@user.password).to_not eq "test123"
        post :update, id: @user.token, user: { password: "test123", password_confirmation: "test123" }
        expect(session[:user_id]).to eq @user.id
        expect(response).to redirect_to profile_path
      end
    end

    context 'when passwords do not match' do
      it 'should set the flash error and render show' do
        post :update, id: @user.token, user: { password: "test123", password_confirmation: "test" }
        expect(flash[:error]).to eq 'Please make sure the passwords you entered match.'
        expect(response).to render_template :show
      end
    end
  end
end