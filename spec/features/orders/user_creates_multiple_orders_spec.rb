require 'spec_helper'

feature "User Multiple Order Creation" do

  before do
    @mcdonalds   = FactoryGirl.create(:restaurant, :status => "approved")
    @burgerking  = FactoryGirl.create(:restaurant, :name => "BurgerKing",
                                                   :slug => "burgerking")
  end

  scenario "creates multiple orders" do
    visit root_url
    within '.content' do
      click_link @mcdonalds.name
    end
    mcdonalds_order = current_order
    expect(mcdonalds_order.restaurant).to eq @mcdonalds

    visit root_url
    within '.content' do
      click_link @burgerking.name
    end
    expect(page.current_path).to eq restaurant_root_path(@burgerking.slug)

    burgerking_order = current_order
    expect(burgerking_order.restaurant).not_to eq @mcdonalds
    expect(burgerking_order.restaurant).to eq @burgerking
    expect(burgerking_order).not_to eq mcdonalds_order
  end
end
