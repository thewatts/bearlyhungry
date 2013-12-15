class HomePageController < ApplicationController
  layout "platform"

  def index
    @restaurants = Restaurant.limit(5)
  end
end
