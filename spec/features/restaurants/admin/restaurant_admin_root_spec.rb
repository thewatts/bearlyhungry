require 'spec_helper'
require 'capybara/rspec'

describe "Restaurant Admin Goes to Restaurant Admin Root" do

  let!(:user) { FactoryGirl.create(:user) }
  rest_attributes = { :name => "McDonalds", :slug => "mcdonalds" }
  let!(:mcdonalds) { FactoryGirl.create(:restaurant, rest_attributes) }

  before do
    FactoryGirl.create(:role, name: "Owner")
    sign_in(user)
  end

  it "shows the dashboard for a specific restaurant" do
    mcdonalds.add_owner(user)
    visit restaurant_admin_root_path(mcdonalds.slug)
    expect(page).to have_content "#{mcdonalds.name} Dashboard"
  end
end
