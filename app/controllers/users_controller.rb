class UsersController < ApplicationController

  def show
    @user = current_user
  end

  def new
    @user = User.new
  end

  def create
    user = create_new_user_with(user_params)
    assign_current_user_and_update_order_for(user) if user.save
    UserMailer.welcome_email(user).deliver
    creation_response_for(user)
  end

  def update
    user = User.find(current_user.id)
    user.update(user_params)
    redirect_to user_path(user)
  end

  def destroy
    current_user.destroy
    session[:user_id] = nil
    flash[:notice] = "User has been deleted."
    redirect_to items_path
  end

  private

  def user_params
    params.require(:user).permit(
      :full_name, :display_name, :email, :password,
      :password_confirmation, :guest, :phone_number
    )
  end

  def create_new_user_with(user_params)
    unless params[:user][:guest].nil?
      Guest.new(user_params)
    else
      User.new(user_params)
    end
  end

  def creation_response_for(user)
    if user.save && !user.guest?
      flash[:notice] = "Successfully Signed Up!"
      redirect_to :back
    elsif user.save && user.guest?
      flash[:notice] = "Please review and pay for your order"
      redirect_to :back
    else
      flash[:error] = user.errors.full_messages
      redirect_to new_user_path
    end
  end

end
