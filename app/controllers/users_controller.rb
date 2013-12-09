class UsersController < ApplicationController

  def show
    @user = User.find(current_user.id)
  end

  def new
    @user = User.new
  end

  def create
    unless params[:user][:guest].nil?
      user = Guest.new(user_params)
    else
      user = User.new(user_params)
    end
    assign_current_user_and_update_order_for(user) if user.save
    creation_response_for(user)
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
    session[:user_id] = nil
    current_user.destroy
    redirect_to items_path
  end

  private

  def user_params
    params.require(:user).permit(
      :full_name, :display_name, :email, :password, :password_confirmation, :guest)
  end

  def creation_response_for(user)
    if user.save && !user.guest?
      flash[:notice] = "Successfully Signed Up!"
      redirect_to user_path(user)
    elsif user.save && user.guest?
      flash[:notice] = "Please review and pay for your order"
      redirect_to order_payment_path
    else
      flash[:error] = user.errors.full_messages
      redirect_to new_user_path
    end
  end

end
