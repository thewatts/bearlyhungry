class HomePageController < ApplicationController
  layout "platform"

  def index
    @restaurants = Restaurant.limit(4)
  end

  def map_data

  end
end
