class SessionsController < ApplicationController

  before_action :set_order

  def create
    email = params[:session][:email]
    password = params[:session][:password]

    user = User.find_by(:email => email)

    if user
      result = user.authenticate(password)
      if result
        session[:user_id] = user.id
        @current_order.update(user_id: user.id, status: "in progress")
        redirect_to items_path
      else
        render :text => "Incorrect email or password."
      end
    else
      render :text => "Email '#{email}' not found."
    end
  end

  def destroy
    reset_session
    flash[:notice] = "You have successfully logged out."
    redirect_to items_path
  end

end

