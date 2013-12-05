class SessionsController < ApplicationController

  before_action :set_order

  def create
    user = User.find_and_authenticate(params[:session])
    assign_current_user_and_update_order_for(user) if user
    flash[:notice] = message_for(user)
    redirect_to destination_for(user)
  end

  def destroy
    reset_session
    flash[:notice] = "You have successfully logged out."
    redirect_to root_path
  end

  private

  def assign_current_user_and_update_order_for(user)
    assign_current_user_to(user)
    current_order.add_user(user)
  end

  def assign_current_user_to(user)
    session[:user_id] = user.id
  end

  def destination_for(user)
    if user.nil?
      :back
    elsif user.admin?
      admin_items_path
    else
      menu_path
    end
  end

  def message_for(user)
    if user.nil?
      "Sorry, Email or Password incorrect."
    else
      "Successfully Logged In!"
    end
  end

end

