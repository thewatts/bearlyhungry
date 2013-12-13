require './spec/spec_helper'

describe Order do

  describe "#host" do
    before do
      @order = FactoryGirl.create(:order)
    end

    it "should respond staging host for the staging Rails.env" do
      env = "staging"
      expect(@order.host(env)).to eq("staging.bearlyhungry.com")
    end

    it "should respond production host for the production Rails.env" do
      env = "production"
      expect(@order.host(env)).to eq("bearlyhungry.com")
    end

    it "should respond localhost for the development Rails.env" do
      env = "development"
      expect(@order.host(env)).to eq("localhost:3000")
    end
  end

end
