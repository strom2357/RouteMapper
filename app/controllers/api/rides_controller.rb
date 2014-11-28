module Api
	class RidesController < ApiController
		def new
			@ride = Ride.new
		end

		def create			
			@ride = Ride.new(ride_params)
			@ride.user_id = current_user.id
			if @ride.save
				render :json => @ride
			else
				flash.now[:errors] = @ride.errors.full_messages
				render :new
			end
		end

		def index
			@rides = current_user.rides
			render json: @rides
		end

		def show
			@ride = Ride.find(params[:id])
			render json: @ride
		end

		private
		def ride_params
			params.require(:ride).permit(:user_id, :title, :date, :directions)
		end
	end
end