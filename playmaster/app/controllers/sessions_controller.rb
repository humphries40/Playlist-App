class SessionsController < ApplicationController
  skip_before_filter :require_login
  # GET /login
  def new
  end

  # POST /login
  def create
    user = User.find_by_name(params[:name])
    if user and user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to user
    else
      redirect_to login_url, alert: "Invalid user/password combination"
    end
  end

  # DELETE /logout
  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: "Logged out"
  end
end
