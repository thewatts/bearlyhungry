class SessionsController < ApplicationController

  def create
    email = params[:session][:email]
    password = params[:session][:password]

    user = User.find_by(:email => email)

    if user
      result = user.authenticate(password)
      if result
        session[:user_id] = user.id
        set_order.user_id = user.id
        set_order.status = "in progress"
        set_order.save
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
    redirect_to items_path
  end

end

