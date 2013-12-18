class Admin::UsersController < ApplicationController
  include UsersHelper
  layout 'admin'

  def index
    @users = current_restaurant.customers
  end

  def new
    @user = current_restaurant.users.new
  end

  def show
    @user = current_restaurant.find_customer(params[:id])
  end

  def edit
    @user = current_restaurant.users.find(params[:id])
  end

  def create
    user = User.new(user_params)
    if user.save
      user.admin_status = params[:user][:admin_status]
      user.save
      set_order.update(user_id: user.id, status: "in_progress")
      flash[:notification] = "User successfully created."
      UserMailer.welcome_email(user).deliver
      redirect_to admin_users_path
    else
      flash[:error] = user.errors.full_messages
      redirect_to admin_users_path
    end
  end

  def update
    user = current_restaurant.users.find(params[:id])
    user.update(user_params)
    redirect_to admin_users_path
  end

  def destroy
    user = current_restaurant.users.find(params[:id])
    user.destroy
    flash[:error] = ["User has successfully been deleted"]
    redirect_to admin_users_path
  end
end
