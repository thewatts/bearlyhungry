class Admin::UsersController < ApplicationController
  include UsersHelper
  layout 'admin'

  def index
    @users = User.select {|user| user.id != current_user.id}
  end

  def new
    @user = User.new
  end

  def show
    @user = User.find(params[:id])
  end

  def edit
    @user = User.find(params[:id])
  end

  def create
    # user = User.new(user_params)
    user = params[:user] ? User.new(params[:user]) : User.new_guest
    if user.save
      current_user(@user) if current_user && current_user.guest?
      session[:user_id] = @user.id
      redirect_to root_url
    else
      render 'new'
    #   user.admin_status = params[:user][:admin_status]
    #   user.save
    #   set_order.update(user_id: user.id, status: "in_progress")
    #   flash[:notification] = "User successfully created."
    #   UserMailer.welcome_email(user).deliver
    #   redirect_to admin_users_path
    # else
    #   flash[:error] = user.errors.full_messages
    #   redirect_to admin_users_path
    end
  end

  def update
    user = User.find(params[:id])
    user.update(user_params)
    redirect_to admin_users_path
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    flash[:error] = ["User has successfully been deleted"]
    redirect_to admin_users_path
  end
end
