class Auth::SchoologyController < ApplicationController


  def login
    puts 'params below'
    puts params.to_s
    puts 'omniauth below'
    puts request.env['omniauth.auth']
    puts 'request below'
    puts request
    render json: {test: true}
  end

end
