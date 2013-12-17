require 'spec_helper'
require 'capybara/rspec'

describe "Restaurant Admin Goes to Restaurant Admin Root" do

  let!(:user) { FactoryGirl.create(:user) }
  rest_attributes = { :name => "McDonalds", :slug => "mcdonalds" }
  let!(:mcdonalds) { FactoryGirl.create(:restaurant, rest_attributes) }

  setup do
    FactoryGirl.create(:role, name: "Owner")
    mcdonalds.add_owner(user)
    sign_in(user)
  end

  it "shows the dashboard for a specific restaurant" do
    expect(user.class).to eq User
    visit restaurant_admin_root_path(mcdonalds.slug)
    expect(page).to have_content "#{mcdonalds.name} Dashboard"
  end
end
