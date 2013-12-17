require 'spec_helper'
require 'capybara/rspec'

describe "A Restaurant Owner" do

  let!(:user) { FactoryGirl.create(:user) }
  rest_attributes = { :name => "McDonalds", :slug => "mcdonalds" }
  let!(:mcdonalds) { FactoryGirl.create(:restaurant, rest_attributes) }
  let!(:item) { FactoryGirl.create(:item, :restaurant => mcdonalds) }

  before do
    FactoryGirl.create(:role, name: "Owner")
    mcdonalds.add_owner(user)
    sign_in(user)
  end

  context "on the dashboard page for their restaurant" do

    it "can view the dashboard for their restaurant" do
      visit restaurant_admin_root_path(mcdonalds.slug)
      expect(page).to have_content "#{mcdonalds.name} Dashboard"
    end

    it "can see the stats for their restaurant" do
      visit restaurant_admin_root_path(mcdonalds.slug)
      expect(page).to have_content "Today's Orders"
      expect(page).to have_content "Today's Sales"
      expect(page).to have_content "New Customers"
    end
  end

  context "on the items page for their restaurant" do

    it "can view the restaurant's items" do
      visit restaurant_admin_root_path(mcdonalds.slug)
      within '.sidebar' do
        click_on "Items"
      end

      expect(page.current_path).to eq restaurant_admin_items_path(mcdonalds.slug)
      expect(page).to have_content item.title
      expect(page).to have_content item.price
      expect(page).to have_content item.available
    end
  end

  context "on the customers page for their restaurant" do

    let!(:customer) { FactoryGirl.create(:user,
                                         :email => "customer@example.com") }
    let!(:non_customer) { FactoryGirl.create(:user,
                                             :email => "fake@example.com") }
    let!(:order) { FactoryGirl.create(:order, :restaurant => mcdonalds,
                                              :user => customer) }
    it "can view the restaurant's customers" do
      visit restaurant_admin_root_path(mcdonalds.slug)
      within '.sidebar' do
        click_on "Customers"
      end

      expect(page.current_path).to eq restaurant_admin_customers_path(mcdonalds.slug)
      expect(page).to have_content customer.email
      expect(page).not_to have_content non_customer.email
    end
  end
end
