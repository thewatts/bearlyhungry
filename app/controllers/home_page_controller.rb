class HomePageController < ApplicationController
  def index
    @restaurants = Restaurant.limit(5)
  end
end
