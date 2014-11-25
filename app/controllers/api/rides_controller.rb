module Api
	class RidesController < ApiController
		def new
			@ride = Ride.new
		end

		def create
			@ride = Ride.new(ride_params)
			if @ride.save
				redirect_to root_url
			else
				flash.now[:errors] = @ride.errors.full_messages
				render :new
			end
		end

		def index
			@rides = current_user.rides
			render json: @rides
		end

		private
		def ride_params
			params.require(:ride).permit(:user_id, :title, :date)
		end
	end
end