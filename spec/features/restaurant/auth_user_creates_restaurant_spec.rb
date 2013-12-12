require 'spec_helper'

feature "Auth User Restaurant Creation" do

  let!(:user) { FactoryGirl.create(:user) }

  scenario "creates restaurant from new restaurant page" do
    #As an authenticated user
    sign_in(user)
    #when I visit the new restaurant page
    visit new_restaurant_path
    #and I click "Create A New Restaurant"
    #and I fill in the name
    fill_in "Your Restaurant Name", with: "Test Restaurant"
    #and I click "Create Restaurant"
    click_on "Start My Restaurant Now"
    expect(page.current_url).to eq admin_restaurant_path
    #then the platform admin receives an email notification
    #and I receive an email notification
    #and the new restaurant is listed as pending in the admin interface
    expect(page).to have_content "Pending"
    #and the restaurant is not visible to customers
    visit restaurant_path(user.restaurants.last)
    expect(page).to have_content "Not Found"
  end
end
