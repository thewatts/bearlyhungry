require 'spec_helper'

feature "Auth User Restaurant Creation" do

  before do
    FactoryGirl.create(:role, name: "Owner")
  end

  let!(:user) { FactoryGirl.create(:user) }

  scenario "creates restaurant from new restaurant page" do
    #As an authenticated user
    sign_in(user)
    #when I visit the new restaurant page
    visit new_restaurant_path
    #and I click "Create A New Restaurant"
    #and I fill in the name
    fill_in "Your Restaurant Name", with: "Test Restaurant"
    fill_in "The URL of your restaurant", with: "test"
    #and I click "Create Restaurant"
    click_on "Start My Restaurant Now"
    expect(page.current_path).to eq restaurant_admin_root_path("test")
    #then the platform admin receives an email notification
    #and I receive an email notification
    #and the new restaurant is listed as pending in the admin interface
    expect(page).to have_content "PENDING"
    #and the restaurant is not visible to customers
    visit restaurant_root_path("test")
    expect(page).to have_content "Sorry,"
  end
end
