class Auth::SchoologyController < ApplicationController
  protect_from_forgery with: :null_sessions

  def login
    # puts 'params below'
    # puts params.to_s
    # puts 'request.env below'
    # puts request.env['omniauth.auth']
    # puts 'request headers below'
    # provider = request.env['omniauth.auth'].provider
    # uid = request.env['omniauth.auth'].uid
    # info = request.env['omniauth.auth'].info.to_hash
    # credentials = request.env['omniauth.auth'].credentials.to_hash
    # puts 'omniauth below'
    # puts request.env['omniauth.auth']
    render json: {test: true}
  end

  def callback
    puts 'callback omniauth'
    puts request.env['omniauth.auth']
    render json: {callbackTest: true}
  end

end
