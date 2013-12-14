require './spec/spec_helper'

describe OrdersController do

  before(:each) do
      @order1 = FactoryGirl.create(:order)
      @user = FactoryGirl.create(:user)
  end

  describe "#create" do
    context "status is pending" do
      it "starts at pending" do
        expect(@order1.status).to eq("pending")
      end
    end

  describe '#update' do
    context "changes to status after certain events" do
      it "status is paid after charge" do
      charge = Stripe::Charge.create(
      :customer    => @user.id,
      :amount      => (@order1.subtotal).to_i,
      :description => 'BearyHungry customer',
      :currency    => 'usd'
      )
      expect(@order1.status).to eq("paid")
      end

      it "status is paid after charge" do
      raise PaymentGateway::CardError.new(e)
      expect(@order1.status).to eq("cancelled")
      end
    end
    end
  end
end
