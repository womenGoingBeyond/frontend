import mainStyles from '../styles/components/CompletedCourse.module.css'

export default function completedCourse( ) {
  
    return (
      <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <div className={"test"}>
        <h1>Completed</h1>
          <img src={`https://picsum.photos/200/300?grayscale`} onclick="testFunction()"/>
            <div className={"test"}>
                <button class="btn"><i class="fa fa-download"></i></button>
            </div>

          
         </div>
      </>
    )
  }