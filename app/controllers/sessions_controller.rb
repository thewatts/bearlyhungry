class SessionsController < ApplicationController

  before_action :set_order

  def index
  end

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

  def destination_for(user)
    if user.nil?
      :back
    elsif user.admin?
      admin_items_path
    else
      review_order_path
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

