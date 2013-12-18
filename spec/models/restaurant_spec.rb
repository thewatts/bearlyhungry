require 'spec_helper'

describe Restaurant do

  before do
      @restaurant = FactoryGirl.create(:restaurant)
      @user = FactoryGirl.create(:user, :guest => false, :email => "asdf@sdg.com")
      Role.create([{ name: "Owner"}])
      @restaurant.add_owner(@user)
    end

  context "finding owners"
    it "can create and array of owners" do
      expect(@restaurant.owners.first.email).to eq ("asdf@sdg.com")
    end
end
