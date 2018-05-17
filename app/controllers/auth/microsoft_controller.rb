require 'jwt'

class Auth::MicrosoftController < ApplicationController

 def microsoft
   # refer to https://msdn.microsoft.com/en-us/office-365/get-started-with-office-365-management-apis
   # for info on what is going on here
   post_params = {
     resource: 'https://manage.office.com',
     client_id: 'd336f13a-60b8-4b82-bc6f-66456a59c8c6',
     redirect_uri: 'http://localhost:3000/auth/microsoft/callback',
     client_secret: ENV['MICROSOFT_SECRET'],
     grant_type: 'authorization_code',
     code: params[:code]
   }

   response = Net::HTTP.post_form(URI.parse('https://login.windows.net/common/oauth2/token'), post_params)
   body = JSON.parse(response.body)
   access_token = body['access_token']
   decoded_access_token = (JWT.decode access_token, nil, false).first
   email = decoded_access_token['unique_name']
   name = "#{decoded_access_token['given_name']} #{decoded_access_token['family_name']}"
   # TODO: find/create a user with this information
   render json: {email: email, name: name}
 end

end
