class Permission < Struct.new(:user)

  def allow?(controller, action, rest_slug)
    return true if controller == "home_page"
    return true if controller == "sessions"
    return true if controller == "users" && action.in?(%w(new create destroy))
    return true if controller == "items" && action.in?(%w(index show show_by_category))
    return true if controller == "orders" && action.in?(%w(show clear_order confirmation))
    return true if controller == "charges"
    return true if controller == "order_items"
    return true if controller == "restaurants" && action.in?( %w(show) )

    if user
      restaurant = Restaurant.find_by(:slug => rest_slug) if rest_slug

      return true if user.admin?
      return true if controller == "restaurants" && action.in?( %w(new create) )
      return true if controller == "charges"
      return true if controller == "orders" && action.in?(%w(index show edit update_current_order clear_order))
      return true if controller == "users" && action.in?(%w(edit update show))
      return true if controller == "items" && action.in?(%w(index show))
      return true if controller == "order_items"

      if user.owner_of?(restaurant)
        return true if controller == "admin/restaurant_dashboard"
        return true if controller == "admin/items"
        return true if controller == "admin/users"
      end
    end

    return false
  end
end

