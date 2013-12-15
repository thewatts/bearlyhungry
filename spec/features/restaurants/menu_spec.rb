require 'spec_helper'

feature "Restaurant Home Page (menu)" do

  before do
    @mcdonalds   = FactoryGirl.create(:restaurant, :status => "approved")
    @burgerking  = FactoryGirl.create(:restaurant, :name => "BurgerKing",
                                                   :slug => "burgerking")

    @big_mac   = FactoryGirl.create(:item, :title => "Big Mac",
                                           :restaurant_id => @mcdonalds.id)
    @mcnuggets = FactoryGirl.create(:item, :title => "McNuggets",
                                           :restaurant_id => @mcdonalds.id)
    @whopper   = FactoryGirl.create(:item, :title => "Whopper",
                                           :restaurant_id => @burgerking.id)
  end

  scenario "user selects restaurant and sees menu" do
    visit root_path
    within '.content' do
      click_link @mcdonalds.name
    end

    expect(page).to have_content @big_mac.title
    expect(page).to have_content @mcnuggets.title
    expect(page).not_to have_content @whopper.title
  end

end
