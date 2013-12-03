class SessionsController < ApplicationController

  before_action :set_order

  def create
    user = User.find_and_authenticate(params[:session])

    if user
      session[:user_id] = user.id
      if user.admin?
        redirect_to admin_items_path
      else
        @current_order.update(user_id: user.id, status: "in progress")
        redirect_to menu_path
      end
    else
      redirect_to :back
    end
  end

  def destroy
    reset_session
    flash[:notice] = "You have successfully logged out."
    redirect_to items_path
  end

end

