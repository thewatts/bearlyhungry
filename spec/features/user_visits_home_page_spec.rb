require 'spec_helper'

feature "Home Page" do
  
  before do
    @mcdonalds  = FactoryGirl.create(:restaurant, :status => "approved")
    @burgerking = FactoryGirl.create(:restaurant, :name => "Burger King",
                                                  :slug => "burgerking")
  end

  scenario "user should see the most recent restaurants" do
    visit root_path
    expect(page).to have_content @mcdonalds.name
    expect(page).to have_content @burgerking.name
    expect(page).to have_link(@mcdonalds.name, 
                              :href => restaurant_root_path(@mcdonalds.slug))
    expect(page).to have_link(@burgerking.name, 
                              :href => restaurant_root_path(@burgerking.slug))
  end

  scenario "user clicks on a restaurant and gets sent to the restaurant page" do
    visit root_path
    click_link @mcdonalds.name
    expect(page).to have_content @mcdonalds.name
  end

end
