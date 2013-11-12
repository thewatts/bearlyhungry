
class Permission < Struct.new(:user)
  def allow?(controller, action)
    return true if controller == "sessions"
    return true if controller == "users" && action.in?(%w[new create])
    return true if controller == "items" && action.in?(%w[index show show_by_category])
    return true if controller == "orders" && action.in?(%w[show])
    return true if controller == "order_items" && action.in?(%w[new create update])
    if user
      return true if user.admin?
      return true if controller == "orders" && action.in?(%w[show])
      return true if controller == "users" && action.in?(%w[edit update])
      return true if controller == "items" && action != "destroy"
    end
    false
  end
end

