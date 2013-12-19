class HomePageController < ApplicationController
  layout "platform"

  def index
    @restaurants = Restaurant.limit(10)
  end

  def map_data

  end
end
