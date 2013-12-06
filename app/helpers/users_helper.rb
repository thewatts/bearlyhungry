module UsersHelper
  def user_params
      params.require(@user).permit(:full_name, :display_name, :email, :password, :password_confirmation)
  end
end
