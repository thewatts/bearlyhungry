class HomePageController < ApplicationController
  layout "application" => :false

  def index
    @restaurants = Restaurant.limit(5)
  end
end
