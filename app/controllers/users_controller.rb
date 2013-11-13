class UsersController < ApplicationController
  include UsersHelper

  def index

  end

  def show
    @user = User.find(current_user.id)
  end

  def new
    @user = User.new
  end

  def create
    user = User.new(user_params)
    if user.save
      current_order.update(user_id: user.id, status: "in_progress")
      session[:user_id] = user.id
      redirect_to :back
      UserMailer.welcome_email(@user).deliver

        format.html { redirect_to(@user, notice: 'User was successfully created.') }

     redirect_to user_path(user)
    else
      # user.errors.each do |error|
      #   logger.info " =========> #{error}"
      # end
      flash[:error] = user.errors.full_messages
      # fail
      redirect_to new_user_path
    end
  end

  def edit
    @user = User.find(current_user.id)
  end

  def update
    user = User.find(current_user.id)
    user.update(user_params)
    redirect_to user_path(user)
  end

  def destroy
    user = User.find(current_user)
    user.destroy
    redirect_to items_path
  end
end
