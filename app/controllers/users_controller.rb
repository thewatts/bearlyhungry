class UsersController < ApplicationController

  def show
    @user = current_user
  end

  def new
    @user = User.new
  end

  def create
    if params[:password] != params[:password_confirmation]
      flash[:notice] = "Password and Password Confirmation must match"
      redirect_to new_user_path
    else
      user = create_new_user_with(user_params)
      assign_current_user_and_update_order_for(user) if user.save
      creation_response_for(user)
    end
  end

  def update

    if current_user.guest? && !passwords_match?
      
      flash[:notice] = "Password and Password Confirmation must match"
      redirect_to :back
    elsif current_user.guest? && passwords_match?
      current_user.update(password: params[:password], password_confirmation: params[:password_confirmation], guest: false)
      flash[:notice] = "Your account has been created!"
      current_user.send_welcome_email
      redirect_to restaurant_order_confirmation_path(current_restaurant.slug)
    else
      current_user.update(user_params)
      redirect_to user_path(current_user)
    end
  end

  def destroy
    current_user.destroy
    session[:user_id] = nil
    flash[:notice] = "User has been deleted."
    redirect_to root_or_menu_path
  end

  private

  def user_params
    params.require(:user).permit(
      :full_name, :display_name, :email, :password,
      :password_confirmation, :guest, :phone_number, :text
    )
  end

  def create_new_user_with(user_params)
      User.new(user_params)
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

  def passwords_match?
    params[:user][:password] == params[:user][:password_confirmation]
  end

end
