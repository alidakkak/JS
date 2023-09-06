class BlimpMovement {
  static  R = 8.314; // Ideal Gas Constant
  // static crossSectionalArea = 1000; // cross-sectional area of the balloon
  static pushCoefficient = 0.5; // push coefficient of the balloon
  // static  M = 4.97; // Molar mass of air
  // static  n = 16206 //moles
  static  G = 9.81; // Acceleration due to gravity
  // static pressure = 101325; // Pressure of air in Pascals
  // static AIR_DENSITY = 1.225;
  static z0 = -225;
  static x0 =290;
  static y0 = 0;
  constructor(temperature, mass,position,velocity,time,Q,P,crossSectionalArea,M,n,pressure,AIR_DENSITY) {
    this.pressure=pressure
    this.AIR_DENSITY=AIR_DENSITY
    this.crossSectionalArea=crossSectionalArea;
    this.M=M;
    this.n=n;
    this.time=time;
    this.Q=Q;
    this.P=P;
    this.velocity=velocity;
    this.temperature = temperature; // Temperature of blimp in Kelvin
    this.mass = mass; // Mass of blimp in kg
    this.position = position; // Position of blimp xyz
  }
  
      calculateAirDensity() {
          const AIR_DENSITY = (this.pressure * this.M) / (BlimpMovement.R * this.temperature); 
          // console.log("AIR_DENSITY="+AIR_DENSITY)
        return AIR_DENSITY;
      }
      calculateMass() {
          const Mass = this.calculateVolume()* (this.calculateAirDensity()- this.AIR_DENSITY)+this.mass; 
          // console.log("Mass="+Mass)
        return Mass;
      }
    
      calculateVolume() {
        const volume = (this.n*BlimpMovement.R*this.temperature)/this.pressure;
        // console.log("volume="+volume)
        return volume;//m^3
      }
  
      calculateArchimedesForce() {
        const ArchimedesForce = this.calculateVolume() * this.calculateAirDensity() * BlimpMovement.G; 
        // console.log("ArchimedesForce="+ArchimedesForce)
        return ArchimedesForce;//Newtons
      }
    
      calculateWeight() {
        const weight = this.calculateMass() * BlimpMovement.G; 
        // console.log("weight="+weight)
        return weight ;//Newtons;
      }
      calculateNetForce() {
          const WindForceY= this.calculateWindForce() * Math.sin(this.P)
          const netForce = WindForceY + this.calculateArchimedesForce() - this.calculateWeight();
          console.log("netForce="+ (WindForceY-this.calculateWeight()))
        return netForce ;//Newtons;
      }
    
      calculateAccelerationY() {
        const acceleration = this.calculateNetForce() / this.calculateMass(); 
        // console.log("acceleration"+acceleration)
        return acceleration;
      }
    
      updatePositionY() {
        const acceleration = this.calculateAccelerationY();
        this.position.y +=acceleration + BlimpMovement.y0; 
    }
//     calculateNetForce2() {
//       const WindForceY= this.calculateWindForce() * Math.sin(this.P)
//       const netForce = WindForceY - this.calculateWeight();
//       console.log("netForce="+ (WindForceY-this.calculateWeight()))
//     return netForce ;//Newtons;
//   }

//   calculateAccelerationY2() {
//     const acceleration = this.calculateNetForce2() / this.calculateMass(); 
//     // console.log("acceleration"+acceleration)
//     return acceleration;
//   }

//   updatePositionY2() {
//     const acceleration = this.calculateAccelerationY2();
//     this.position.y +=acceleration + BlimpMovement.y0; 
// }

      
  
   calculateWindForce() {
    let windSpeedSquared = this.velocity * this.velocity;
    let windForce = 0.5 * this.AIR_DENSITY * windSpeedSquared * BlimpMovement.pushCoefficient * this.crossSectionalArea;
    // console.log("windForce="+windForce)
    return  windForce;
  }
   calculateAccelerationXZ() {
    let windForceXZ = this.calculateWindForce()*Math.cos(this.P);
    let netForce = windForceXZ 
    return (netForce / this.calculateMass());
  }

   updatePositionXZ() {
    const acceleration = this.calculateAccelerationXZ();
    // console.log("acceleration"+acceleration)
    this.position.x =(0.5 * acceleration*Math.cos(this.Q)* this.time )+BlimpMovement.x0;
    this.position.z =(0.5 * acceleration*Math.sin(this.Q)* this.time ) +BlimpMovement.z0;
  }

}






module.exports = BlimpMovement;
