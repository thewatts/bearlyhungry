
class Permission < Struct.new(:user)
  def allow?(controller, action)
    return true if controller == "sessions"
    return true if controller == "users" && action.in?(%w[new create])
    return true if controller == "items" && action.in?(%w[index show])
    return true if controller == "orders" && action.in?(%w[index show])
    return true if controller == "order_items" && action.in?(%w[new create update])
    if user
      return true if controller == "users" && action.in?(%w[edit update])
      return true if controller == "items" && action != "destroy"
      return true if user.admin?
    end
    false
  end
end

