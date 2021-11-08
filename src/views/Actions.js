import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

export default (billUrl) => {
  if(billUrl.includes(".pdf")){
    return (
      `<div class="icon-actions">
        <a id="download" data-testid="icon-download" href=${billUrl} target="_blank" rel="noopener">
        ${downloadBlueIcon}
        </a>
      </div>`
    )
  }else{
    return (
      `<div class="icon-actions">
        <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
        ${eyeBlueIcon}
        </div>
      </div>`
    )
  }
  
}