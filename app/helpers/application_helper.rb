module ApplicationHelper

  def current_user
    @current_user ||= lookup_user
  end

  def lookup_user
    if session[:user_id]
      User.find(session[:user_id])
    end
  end

end
